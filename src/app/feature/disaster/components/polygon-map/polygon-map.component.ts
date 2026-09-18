import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import * as L from 'leaflet';

import { DEFAULT_MAP_ZOOM, SRI_LANKA_CENTER } from '../../data/mock-alerts';
import { GeoPoint } from '../../models/disaster-alert.model';
import { MIN_POLYGON_VERTICES, polygonCentroid } from '../../models/polygon-geometry';

export type DrawMode = 'idle' | 'draw' | 'edit';

const POLYGON_STYLE: L.PolylineOptions = {
  color: '#1a5cf3',
  weight: 2,
  dashArray: '6 4',
  fillColor: '#1a5cf3',
  fillOpacity: 0.15,
};

const VERTEX_STYLE: L.CircleMarkerOptions = {
  radius: 7,
  color: '#0b3fb0',
  weight: 3,
  fillColor: '#ffffff',
  fillOpacity: 1,
};

@Component({
  selector: 'app-polygon-map',
  standalone: false,
  templateUrl: './polygon-map.component.html',
  styleUrl: './polygon-map.component.scss',
})
export class PolygonMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly zone = inject(NgZone);

  @Input() boundary: GeoPoint[] = [];
  @Input() center: GeoPoint = SRI_LANKA_CENTER;
  @Input() zoom = DEFAULT_MAP_ZOOM;

  @Input() readonly = false;
  @Input() focus: GeoPoint | null = null;
  @Input() focusZoom = 11;
  @Input() focusLabel = '';

  @Output() boundaryChange = new EventEmitter<GeoPoint[]>();

  @ViewChild('mapHost', { static: true }) private mapHost!: ElementRef<HTMLDivElement>;

  protected readonly mode = signal<DrawMode>('idle');
  protected readonly vertexCount = signal(0);

  private map?: L.Map;
  private resizeObserver?: ResizeObserver;
  private polygon?: L.Polygon;
  private focusMarker?: L.Marker;
  private draftLine?: L.Polyline;
  private readonly handles: L.CircleMarker[] = [];

  private points: GeoPoint[] = [];

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.createMap());
    this.points = [...this.boundary];
    this.vertexCount.set(this.points.length);
    this.renderShape();
    this.renderFocus(this.points.length < MIN_POLYGON_VERTICES);
    this.fitToBoundary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      return;
    }

    if (changes['boundary'] && !this.samePoints(this.boundary, this.points)) {
      this.points = [...this.boundary];
      this.vertexCount.set(this.points.length);
      this.mode.set('idle');
      this.renderShape();
      this.fitToBoundary();
    }

    if (changes['focus']) {
      this.renderFocus(true);
    }
  }

  ngOnDestroy(): void {
    this.focusMarker?.remove();
    this.focusMarker = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.map?.remove();
    this.map = undefined;
  }

  protected get canFinish(): boolean {
    return this.points.length >= MIN_POLYGON_VERTICES;
  }

  protected get hasBoundary(): boolean {
    return this.boundary.length >= MIN_POLYGON_VERTICES;
  }

  protected startDrawing(): void {
    if (this.readonly) {
      return;
    }
    this.points = [];
    this.vertexCount.set(0);
    this.mode.set('draw');
    this.renderShape();
  }

  protected toggleEdit(): void {
    if (this.readonly || !this.hasBoundary) {
      return;
    }
    this.mode.set(this.mode() === 'edit' ? 'idle' : 'edit');
    this.renderShape();
  }

  protected undoLastPoint(): void {
    if (this.mode() !== 'draw' || !this.points.length) {
      return;
    }
    this.points = this.points.slice(0, -1);
    this.vertexCount.set(this.points.length);
    this.renderShape();
  }

  protected finishDrawing(): void {
    if (!this.canFinish) {
      return;
    }
    this.mode.set('idle');
    this.renderShape();
    this.emitBoundary();
  }

  protected cancelDrawing(): void {
    this.points = [...this.boundary];
    this.vertexCount.set(this.points.length);
    this.mode.set('idle');
    this.renderShape();
  }

  protected clearBoundary(): void {
    if (this.readonly) {
      return;
    }
    this.points = [];
    this.vertexCount.set(0);
    this.mode.set('idle');
    this.renderShape();
    this.emitBoundary();
  }

  private createMap(): void {
    this.map = L.map(this.mapHost.nativeElement, {
      center: [this.center.lat, this.center.lng],
      zoom: this.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => this.onMapClick(event));

    this.watchContainerSize();
  }

  private watchContainerSize(): void {
    setTimeout(() => this.map?.invalidateSize());

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObserver.observe(this.mapHost.nativeElement);
  }

  private onMapClick(event: L.LeafletMouseEvent): void {
    if (this.mode() !== 'draw') {
      return;
    }

    this.zone.run(() => {
      this.points = [...this.points, { lat: event.latlng.lat, lng: event.latlng.lng }];
      this.vertexCount.set(this.points.length);
      this.renderShape();
    });
  }

  private renderShape(): void {
    if (!this.map) {
      return;
    }

    this.clearLayers();
    const latLngs = this.points.map((point) => L.latLng(point.lat, point.lng));

    if (this.mode() === 'draw') {
      if (latLngs.length >= MIN_POLYGON_VERTICES) {
        this.polygon = L.polygon(latLngs, { ...POLYGON_STYLE, fillOpacity: 0.1 }).addTo(this.map);
      } else if (latLngs.length > 1) {
        this.draftLine = L.polyline(latLngs, { ...POLYGON_STYLE, fill: false }).addTo(this.map);
      }
      latLngs.forEach((latLng, index) => this.addHandle(latLng, index, false));
      return;
    }

    if (latLngs.length >= MIN_POLYGON_VERTICES) {
      this.polygon = L.polygon(latLngs, POLYGON_STYLE).addTo(this.map);
    }

    if (this.mode() === 'edit') {
      latLngs.forEach((latLng, index) => this.addHandle(latLng, index, true));
    }
  }

  private clearLayers(): void {
    this.polygon?.remove();
    this.polygon = undefined;
    this.draftLine?.remove();
    this.draftLine = undefined;
    this.handles.forEach((handle) => handle.remove());
    this.handles.length = 0;
  }

  private addHandle(latLng: L.LatLng, index: number, editable: boolean): void {
    if (!this.map) {
      return;
    }

    const handle = L.circleMarker(latLng, VERTEX_STYLE).addTo(this.map);
    this.handles.push(handle);

    if (this.mode() === 'draw' && index === 0) {

      handle.on('click', () => this.zone.run(() => this.finishDrawing()));
      return;
    }

    if (editable) {
      this.makeDraggable(handle, index);
    }
  }

  private makeDraggable(handle: L.CircleMarker, index: number): void {
    handle.on('mousedown', () => {
      const map = this.map;
      if (!map) {
        return;
      }

      let moved = false;
      map.dragging.disable();

      const onMove = (event: L.LeafletMouseEvent) => {
        moved = true;
        handle.setLatLng(event.latlng);
        this.points[index] = { lat: event.latlng.lat, lng: event.latlng.lng };
        this.polygon?.setLatLngs(this.points.map((point) => L.latLng(point.lat, point.lng)));
      };

      const onUp = () => {
        map.off('mousemove', onMove);
        map.off('mouseup', onUp);
        map.dragging.enable();

        this.zone.run(() => {
          if (moved) {
            this.emitBoundary();
          } else {
            this.removeVertex(index);
          }
        });
      };

      map.on('mousemove', onMove);
      map.on('mouseup', onUp);
    });
  }

  private removeVertex(index: number): void {
    if (this.points.length <= MIN_POLYGON_VERTICES) {
      return;
    }
    this.points = this.points.filter((_, i) => i !== index);
    this.vertexCount.set(this.points.length);
    this.renderShape();
    this.emitBoundary();
  }

  private emitBoundary(): void {
    this.boundaryChange.emit([...this.points]);
  }

  private renderFocus(moveMap: boolean): void {
    this.focusMarker?.remove();
    this.focusMarker = undefined;

    if (!this.map || !this.focus) {
      return;
    }

    const icon = L.divIcon({
      className: 'map-focus-pin',
      html: `<span class="map-focus-pin__dot"></span><span class="map-focus-pin__label">${this.focusLabel}</span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    this.focusMarker = L.marker([this.focus.lat, this.focus.lng], { icon, interactive: false }).addTo(this.map);

    if (moveMap) {
      this.map.flyTo([this.focus.lat, this.focus.lng], this.focusZoom, { duration: 0.8 });
    }
  }

  private fitToBoundary(): void {
    if (!this.map || this.points.length < MIN_POLYGON_VERTICES) {
      return;
    }
    const centroid = polygonCentroid(this.points);
    if (centroid) {
      this.map.setView([centroid.lat, centroid.lng], 10);
    }
  }

  private samePoints(a: GeoPoint[], b: GeoPoint[]): boolean {
    return a.length === b.length && a.every((point, i) => point.lat === b[i].lat && point.lng === b[i].lng);
  }
}
