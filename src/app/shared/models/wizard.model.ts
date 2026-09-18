export interface WizardStep {

  id: string;
  label: string;

  hint?: string;
}

export type WizardActionVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'link';

export interface WizardAction {
  id: string;
  label: string;
  variant: WizardActionVariant;
  icon?: string;
  disabled?: boolean;

  alignEnd?: boolean;
}

export const WIZARD_ACTION_CLASS: Record<WizardActionVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline-secondary',
  danger: 'btn-danger',
  link: 'btn-link',
};
