// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/about`
  | `/login`
  | `/posts`
  | `/posts/:id`
  | `/posts/:id/:pid?`
  | `/posts/:id/deep`
  | `/register`
  | `/splat/${string}`

export type Params = {
  '/posts/:id': { id: string }
  '/posts/:id/:pid?': { id: string; pid?: string }
  '/posts/:id/deep': { id: string }
}

export type ModalPath = `/modal`

export type LoaderPath = `pages`

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams, useRouteLoaderData } = hooks<Path, Params, ModalPath, LoaderPath>()
export const { redirect } = utils<Path, Params>()
