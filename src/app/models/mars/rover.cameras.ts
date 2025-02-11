export enum OpportunityCameras {
  FHAZ,
  RHAZ,
  NAVCAM,
  PANCAM,
  MINITES,
}

export enum CuriosityCameras {
  FHAZ,
  FHAZ_LEFT_B,
  FHAZ_RIGHT_B,
  RHAZ,
  RHAZ_RIGHT_B,
  RHAZ_LEFT_B,
  MAST,
  CHEMCAM,
  CHEMCAM_RMI,
  MAHLI,
  MARDI,
  NAVCAM,
  NAV_RIGHT_B,
  NAV_LEFT_B,
}

export enum SpiritCameras {
  FHAZ,
  RHAZ,
  NAVCAM,
  PANCAM,
  MINITES,
}

export enum PerseveranceCameras {
  EDL_RUCAM,
  EDL_RDCAM,
  EDL_DDCAM,
  EDL_PUCAM1,
  EDL_PUCAM2,
  NAVCAM_LEFT,
  NAVCAM_RIGHT,
  MCZ_RIGHT,
  MCZ_LEFT,
  FRONT_HAZCAM_LEFT_A,
  FRONT_HAZCAM_RIGHT_A,
  REAR_HAZCAM_LEFT,
  REAR_HAZCAM_RIGHT,
  SKYCAM,
  SHERLOC_WATSON,
}

export type MarsRoverCameras =
  | OpportunityCameras
  | CuriosityCameras
  | SpiritCameras
  | PerseveranceCameras;
