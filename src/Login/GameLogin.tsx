import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

export const DB_STR = 'ttt_game_login'

export interface ILoginData {
    teamId: string
    userId: string
}

const INIT_LOGINDATA: ILoginData = {
    teamId: "",
    userId: ""
}



const login = (userId:number, teamId: number) => {
    return new Promise<{code:string,message:string}>((rej,res) => {
        if(Number.isInteger(teamId) && Number.isInteger(userId)) {
            localStorage.setItem(DB_STR, JSON.stringify({userId,teamId}))
            rej({
                code: "OK",
                message: "Login success"
            })
        } else {
            rej({
                code: "FAIL",
                message: "userId or TeamId not set"
            })
        }
    })
}

export const isLoggedIn = () => {
    return new Promise<false|ILoginData>((res,rej) => {
        const login_data = localStorage.getItem(DB_STR)
        if(login_data) {
            const parsed = JSON.parse(login_data)
            if(parsed["teamId"] && parsed["userId"]) {
                return res(parsed)
            }

        } 
        return rej(false)
    })
}

export const GameLogin = () => {
    const [loginData,setLoginData] = useState<ILoginData>(INIT_LOGINDATA)
    const [canLogin,setCanLogin] = useState(false)
    const history = useHistory()

    

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await login(parseInt(loginData.userId),parseInt(loginData.teamId))
        if(isLoggedIn()){
            setCanLogin(true)
        }
    }


    isLoggedIn()
        .then(() => {
            setCanLogin(true)
        })
        .catch(err => console.log("LOGIN ERROR: ",err))

    if(canLogin) {
        history.push('/game')
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-6 offset-3">
                    <h1>Game Login</h1>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-6 offset-3">
                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="form-group">
                            <label htmlFor="teamId">TeamID</label>
                            <input id="teamId" className="form-control" type="text" placeholder="1243" value={loginData.teamId} onChange={e => setLoginData({...loginData,teamId:e.target.value})}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="userId">UserID</label>
                            <input id="userId" className="form-control" type="text" placeholder="1046" value={loginData.userId} onChange={e => setLoginData({...loginData,userId:e.target.value})}/>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>

                </div>
            </div>

        </div>
    )
}