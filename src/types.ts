import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'wiser-schedule-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface WiserScheduleCardConfig extends LovelaceCardConfig {
  name?: string;
  panel_mode?: boolean;
  home_screen?: 'schedules' | 'overview';
  overview_details?: boolean;
  theme_colors: boolean;
  display_only: boolean;
  admin_only: boolean;
  view_type: string;
  hub: string;
  selected_schedule?: string;
  hide_card_borders: boolean;
  hide_card_background?: boolean;
}

interface SunTime {
  day: string;
  time: string;
}

export interface SunTimes {
  Sunrises: SunTime[];
  Sunsets: SunTime[];
}

export interface ScheduleSlot {
  Time: string;
  Setpoint: string;
  UpperSetpoint?: string | number;
  PassiveScheduled?: boolean;
  PassiveMode?: boolean;
  PassiveStrategy?: 'modulating' | 'temperature_limiter';
  SpecialTime: string;
}

export interface ScheduleDay {
  day: string;
  slots: ScheduleSlot[];
}

export interface Schedule {
  Id: number;
  Name: string;
  Type: string;
  SubType: string;
  Assignments: ScheduleAssignments[];
  ScheduleData: ScheduleDay[];
  MinSetpoint?: number;
  MaxSetpoint?: number;
  PassiveRange?: boolean;
  PassiveRangeType?: 'native' | 'external' | 'scheduled';
  PassiveControl?: boolean;
  Capabilities?: {
    PassiveControl?: boolean;
  };
  PassiveControlDefaults?: {
    Enabled: boolean;
    Strategy: 'modulating' | 'temperature_limiter';
  };
  MinUpperSetpoint?: number;
  MaxUpperSetpoint?: number;
  PresetOptions?: SchedulePresetOption[];
}

export interface SchedulePresetOption {
  name: string;
  icon: string;
  temperature: number;
}

export interface ScheduleAssignments {
  Id: number;
  Name: string;
}

export interface ScheduleListItem {
  SubType?: string;
  Id: number;
  Type: string;
  Name: string;
  Assignments: number;
}

export interface Room {
  Id: number;
  Name: string;
}

export interface Entities {
  Id: number;
  Name: string;
}

export interface NewSchedule {
  Name: string;
  Type: string;
}

enum WiserEvent {
  WiserUpdated = 'wiser_updated',
}

export interface WiserEventData {
  hub: string;
  event: WiserEvent;
}

export interface WiserError {
  code: string;
  message: string;
}
