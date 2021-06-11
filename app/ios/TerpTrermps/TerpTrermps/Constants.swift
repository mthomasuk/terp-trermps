//
//  Constants.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 11/06/2021.
//

import Foundation

struct Constants {
    enum MessageTypes: String {
        case BATTLE_START = "battle-started"
        case BATTLE_END = "battle-ended"
        case USER_JOINED_BATTLE = "user-joined-battle"
        case WINNING_HAND_PLAYED = "winning-hand-played"
        case ROUND_ATTRIBUTE_SELECTED = "round-attribute-selected"
        case ROUND_IS_A_DRAW = "round-is-a-draw"
    }
    
    let Attributes: [String] = [
        "strength",
        "skill",
        "magical_force",
        "weapons",
        "power"
    ]
}
