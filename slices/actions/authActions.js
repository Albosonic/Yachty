export const MEMBER_OBJECT = 'MEMBER_OBJECT';
export const NEW_MEMBER_APPLICATION = 'NEW_MEMBER_APPLICATION';
export const NON_MEMBER_OBJECT = 'NON_MEMBER_OBJECT';
export const UPDATE_LOGO = 'UPDATE_LOGO';
export const YC_EVENT = 'YC_EVENT';
export const CLEAR_STATE = 'CLEAR_STATE';
export const UPDATE_VESSEL_IMAGE = 'UPDATE_VESSEL_IMAGE';
export const UPDATE_PROFILE_PICTURE = 'UPDATE_PROFILE_PICTURE';
export const UPDATE_IS_RACER = 'UPDATE_IS_RACER';
export const UPDATE_HULL_MATERIAL_ACT = 'UPDATE_HULL_MATERIAL_ACT';
export const UPDATE_VESSEL_SPECS_ACT = 'UPDATE_VESSEL_SPECS_ACT';
export const UPDATE_VESSEL_TYPE_ACT = 'UPDATE_VESSEL_TYPE_ACT';
export const UPDATE_NEW_VESSEL_ACT = 'UPDATE_NEW_VESSEL_ACT';
export const BETA_USER_IS_COMMODORE = 'BETA_USER_IS_COMMODORE';
export const ROOM_TYPES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
}

export const clearState = () => {
 return {
  type: CLEAR_STATE,
 }
}

export const addMember = (userData) => {
  return {
    type: MEMBER_OBJECT,
    payload: userData,
  }
}

export const addNewMemberApplication = (newMemberApplications) => ({
  type: NEW_MEMBER_APPLICATION,
  payload: newMemberApplications,
});

export const addNonMember = (nonMember) => ({
  type: NON_MEMBER_OBJECT,
  payload: nonMember,
});

export const updateLogo = (logo) => {
  return {
    type: UPDATE_LOGO,
    payload: logo
  }
}

export const updateUserProfilePicture = (pic) => {
  return {
    type: UPDATE_PROFILE_PICTURE,
    payload: pic,
  }
}

export const updateIsRacer = (isRacer) => {
  return {
    type: UPDATE_IS_RACER,
    payload: isRacer,
  }
}

export const updateVesselImgAct = (vesselImage) => {
  return {
    type: UPDATE_VESSEL_IMAGE,
    payload: vesselImage,
  }
};

export const updateVesselHullMaterialAct = (hullMaterial) => {
  return {
    type: UPDATE_HULL_MATERIAL_ACT,
    payload: hullMaterial
  }
}

export const updateVesselSpecsAct = (specs) => {
  return {
    type: UPDATE_VESSEL_SPECS_ACT,
    payload: specs
  }
}

export const updateVesselTypeAct = (type) => {
  return {
    type: UPDATE_VESSEL_TYPE_ACT,
    payload: type,
  }
}

export const updateNewVesselAct = (newVessel) => {
  return {
    type: UPDATE_NEW_VESSEL_ACT,
    payload: newVessel
  }
}

export const betaUpdateUserIsCommodoreAct = (isCommodore) => {
  return {
    type: BETA_USER_IS_COMMODORE,
    payload: isCommodore,
  }
}
