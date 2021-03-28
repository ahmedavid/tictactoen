import React from 'react'
import './PlayerIndicator.css'

interface IProps {
    player: "X" | "O"
}

export const PlayerIndicator  = ({player}: IProps) => {
    return (
        <div className="player_indicator">
            <div className={`player_indicator_item player_indicator_item_x ${player === "O" ? "player_indicator_item_active" : ""}`}>O</div>
            <div className={`player_indicator_item player_indicator_item_x ${player === "X" ? "player_indicator_item_active" : ""}`}>X</div>
        </div>
    )
} 