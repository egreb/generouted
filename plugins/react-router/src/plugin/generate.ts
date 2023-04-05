import { readFileSync, writeFileSync } from 'fs'
import fg from 'fast-glob'

import { getRouteExports, patterns } from '@generouted/core'

import { Options } from './options'
import { template } from './template'

const generateRouteTypes = async (options: Options) => {
  const files = await fg(options.source || './src/pages/**/[\\w[-]*.{jsx,tsx}', { onlyFiles: true })
  const modal = await fg('./src/pages/**/[+]*.{jsx,tsx}', { onlyFiles: true })

  const filtered = files.filter((key) => !key.includes('/_') && !key.includes('/404'))
  const params: string[] = []

  const paths = filtered.map((key) => {
    const path = key
      .replace(...patterns.route)
      .replace(...patterns.splat)
      .replace(...patterns.param)
      .replace(/\(\w+\)\/|\/?_layout/g, '')
      .replace(/\/?index|\./g, '/')
      .replace(/(\w)\/$/g, '$1')
      .split('/')
      .map((segment) => segment.replace(...patterns.optional))
      .join('/')

    if (path) {
      const param = path.split('/').filter((segment) => segment.startsWith(':'))

      if (param.length) {
        params.push(`'/${path}': { ${param.map((p) => p.replace(/:(.+)(\?)?/, '$1$2:') + ' string').join('; ')} }`)
      }

      if (path.includes('*')) return '/' + path.replace(/\*/g, '${string}')
      return path.length > 1 ? `/${path}` : path
    }
  })

  const loaderDataPaths = files
    .map((path) => {
      if (!path) return false
      const paths = path.split('/')
      const last = paths.at(-1)

      const content = readFileSync(path, { encoding: 'utf-8' })
      const loaders = getRouteExports(content)

      if (loaders.loader) {
        // if exporting loader from a _layout, return parent path
        const lastDirectory = paths.at(-2)
        if (last === '_layout.tsx') return lastDirectory
        // if filename is the same as parent directory it means it's a layout file
        if (last?.replace('.tsx', '') === lastDirectory || last?.replace('.jsx', '') === lastDirectory) {
          return lastDirectory
        }

        return paths
          .filter(
            (path) =>
              // ignored paths
              !['.', '..', 'src', 'index.tsx', 'index.jsx'].includes(path) &&
              // ignore pathless paths
              !(path.startsWith('(') && path.endsWith(')'))
          )
          .join('/')
      }

      return false
    })
    .filter(Boolean)

  const modals = modal.map(
    (path) =>
      `/${path
        .replace(...patterns.route)
        .replace(/\+/g, '')
        .replace(/(\/)?index/g, '')
        .replace(/\./g, '/')}`
  )

  const types =
    `export type Path =\n  | "${[...new Set(paths.filter(Boolean))].sort().join('"\n  | "')}"`.replace(/"/g, '`') +
    '\n\n' +
    `export type Params = {\n  ${params.sort().join('\n  ')}\n}` +
    '\n\n' +
    `export type ModalPath = "${modals.sort().join('" | "') || 'never'}"`.replace(/"/g, modals.length ? '`' : '') +
    '\n\n' +
    `export type LoaderPath = "${loaderDataPaths.sort().join('" | "') || 'never'}"`.replace(
      /"/g,
      loaderDataPaths.length ? '`' : ''
    )

  const content = template.replace('// types', types)
  const count = paths.length + modals.length

  return { content, count }
}

let latestContent = ''

export const generate = async (options: Options) => {
  const start = Date.now()
  const { content, count } = await generateRouteTypes(options)
  console.log(`${new Date().toLocaleTimeString()} [generouted] scanned ${count} routes in ${Date.now() - start} ms`)

  if (latestContent === content) return
  latestContent = content

  writeFileSync(`./src/${options.output}`, content)
}
