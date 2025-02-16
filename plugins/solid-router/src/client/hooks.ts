import { NavigateOptions, useLocation, useMatch, useNavigate, useParams } from '@solidjs/router'
import { MatchFilters } from '@solidjs/router/dist/types'

import { generatePath } from './utils'

export const hooks = <Path extends string, Params extends Record<string, any>, ModalPath extends string>() => {
  type ParamPath = keyof Params
  type Options<P> = P extends ParamPath
    ? [Partial<NavigateOptions> & { params: Params[P] }]
    : [Partial<NavigateOptions> & { params?: never }] | []

  return {
    useParams: <P extends ParamPath>(path: P) => useParams<Params[typeof path]>() as Params[P],
    useNavigate: () => {
      const navigate = useNavigate()
      return <P extends Path>(href: P, ...[options]: Options<P>) => {
        navigate(options?.params ? generatePath(href, options.params) : href, options)
      }
    },
    useMatch: <P extends Path>(path: () => P, matchFilters?: MatchFilters<P>) => {
      return useMatch(path, matchFilters)
    },
    useModals: () => {
      const location = useLocation<{ modal: string }>()
      const navigate = useNavigate()

      type Options<P> = Partial<NavigateOptions<{ modal: string }>> &
        (P extends ParamPath ? { at?: P; params: Params[P] } : { at?: P; params?: never })

      return {
        current: location.state?.modal || '',
        open: <P extends Path>(path: ModalPath, options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          navigate(at || location.pathname, { ...opts, state: { ...location.state, ...state, modal: path } })
        },
        close: <P extends Path>(options?: Options<P>) => {
          const { at, state, ...opts } = options || {}
          navigate(at || location.pathname, { ...opts, state: { ...location.state, ...state, modal: '' } })
        },
      }
    },
  }
}
