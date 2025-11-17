import { redirect } from 'next/navigation'

export default function Page() {
  // redirect `/auth` to the main auth entry `/auth/login`
  redirect('/auth/login')
}
