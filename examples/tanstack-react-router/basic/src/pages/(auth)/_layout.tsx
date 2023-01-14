import { Outlet } from '@tanstack/react-router'

export default function Layout() {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  )
}
