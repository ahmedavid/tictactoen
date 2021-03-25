import React, { useEffect, useState } from 'react'

export const DB_STR = 'ttt_game_login'

export interface ILoginData {
    teamId: number
    userId: number
}

const INIT_LOGINDATA: ILoginData = {
    teamId: 0,
    userId: 0
}


interface IProps {
    checkLogin: () => void
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



export const GameLogin = ({checkLogin}:IProps) => {
    const [loginData,setLoginData] = useState<ILoginData>(INIT_LOGINDATA)
    const [canLogin,setCanLogin] = useState(false)

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await login(loginData.userId,loginData.teamId)
        checkLogin()
    }


    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-6 offset-3 text-center">
                    <h1>TicTacToeN Login</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-6 offset-3">
                    <hr/>
                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="form-group">
                            <label htmlFor="teamId">TeamID</label>
                            <input 
                                id="teamId" 
                                className="form-control" 
                                type="text" 
                                placeholder="1243" 
                                value={loginData.teamId === 0 ? "" : loginData.teamId } 
                                onChange={e => setLoginData({...loginData,teamId: isNaN(parseInt(e.target.value)) ? 0 :  parseInt(e.target.value)})}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="userId">UserID</label>
                            <input 
                                id="userId" 
                                className="form-control" 
                                type="text" placeholder="1046" 
                                value={loginData.userId === 0 ? "" : loginData.userId } 
                                onChange={e => setLoginData({...loginData,userId:isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)})}/>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>

                </div>
            </div>

        </div>
    )
}