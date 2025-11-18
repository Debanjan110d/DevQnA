"use client"
import { useAuthStore } from '@/store/Auth'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { InputWithIcon } from '@/components/ui/input-with-icon'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function RegisterPage() {
    const {createAccount,login} = useAuthStore();
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState("");


    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        //collect data
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
;

        //validation
        if(!email || !password || !name){
            setError('Please fill in all the fields');
            setIsLoading(false);
            return;
        }

        //call the store
        setIsLoading(true);
        setError("");


        const response = await createAccount(email as string,password as string,name as string);
        if (response.error) {
            setError(()=> response.error!.message);
            
        } else {
            const loginResponse = await login(email as string,password as string);
            
            if (loginResponse.error) {
                setError(()=> loginResponse.error!.message);
            }
        }
        setIsLoading(()=> false);

    }
    
    return (
        <div className="min-h-[calc(100vh-0px)] flex items-center justify-center px-4">
          <Card>
            <h1 className="text-2xl font-semibold mb-1" style={{ color: '#ffffff' }}>Create an account</h1>
            <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>Start your journey with a free account.</p>

            {error && <p className="text-sm mb-2" style={{ color: '#ef4444' }}>{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <InputWithIcon id="name" name="name" type="text" required icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <InputWithIcon id="email" name="email" type="email" required icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <InputWithIcon id="password" name="password" type="password" required icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0 1 10 0v3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Registering…' : 'Register'}</Button>
                </div>
            </form>

            <div className="mt-4 text-sm text-center" style={{ color: '#94a3b8' }}>
              <span>Already have an account? </span>
              <Link href="/login" style={{ color: '#0ea5a4', textDecoration: 'none' }} className="hover:underline">Sign in</Link>
            </div>
          </Card>
        </div>
    )
}

export default RegisterPage