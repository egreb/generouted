// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/about`
  | `/blog`
  | `/blog/:slug`
  | `/blog/tags`
  | `/blog/w/o/layout`
  | `/docs/:lang?`
  | `/docs/:lang?/resources`
  | `/login`
  | `/register`

export type Params = {
  '/blog/:slug': { slug: string }
  '/docs/:lang?': { lang?: string }
  '/docs/:lang?/resources': { lang?: string }
}

export type ModalPath = `/info`

export type LoaderPath = ``

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath, LoaderPath>()
export const { redirect } = utils<Path, Params>()
