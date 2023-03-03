import { rest } from 'msw';
import { LOCAL_ENVIRONMENT } from '../../__tests__/env';
import { findFixtures, patchFixtures } from './responseData/fixture';
import { findFloorplan } from './responseData/floorplan';
import { findInstaller } from './responseData/installer';
import { findProject, patchProject } from './responseData/project';
const Buffer = require('buffer').Buffer;

export const handlers = [
  rest.post(LOCAL_ENVIRONMENT, (req, res, ctx) => {
    const data = JSON.parse(new Buffer.from(req._body).toString('utf-8'));
    if (data.query.includes('findProject')) {
      return res(ctx.json(findProject));
    }

    if (data.query.includes('patchProject')) {
      return res(ctx.json(patchProject));
    }

    if (data.query.includes('findFloorplans')) {
      return res(ctx.json(findFloorplan));
    }

    if (data.query.includes('findFixtures')) {
      return res(ctx.json(findFixtures));
    }

    if (data.query.includes('patchFixtures')) {
      return res(ctx.json(patchFixtures));
    }

    if (data.query.includes('findInstaller')) {
      return res(ctx.json(findInstaller));
    }

    return res(null);
  }),
];
