//
//  RoundModel.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import Foundation

struct RoundModel: Decodable {
    let id: String
    let battle_id: String
    let attribute: String
    let leader: String
    let started_at: String
    let winning_hand: HandModel?
}

extension RoundModel {
    enum CodingKeys: String, CodingKey {
        case id, battle_id, attribute, leader, started_at, winning_hand
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(String.self, forKey: .id)
        battle_id = try container.decodeIfPresent(String.self, forKey: .battle_id) ?? ""
        attribute = try container.decodeIfPresent(String.self, forKey: .attribute) ?? ""
        leader = try container.decodeIfPresent(String.self, forKey: .leader) ?? ""
        started_at = try container.decodeIfPresent(String.self, forKey: .started_at) ?? ""
        
        winning_hand = try container.decodeIfPresent(HandModel.self, forKey: .winning_hand) ?? nil
    }
}
