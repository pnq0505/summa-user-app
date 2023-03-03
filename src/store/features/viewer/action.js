import { createAction } from '@reduxjs/toolkit';

export const selectedFixtureId = createAction('SELECT_FIXTURE'); // params: { fixtureId, shouldShowInfo }
export const showModal = createAction('SHOW_MODAL'); // params: { modalId }
export const hideCurrentModal = createAction('HIDE_CURRENT_MODAL');
export const clearAllModal = createAction('CLEAR_ALL_MODAL');
