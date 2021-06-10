//
//  DeckModel.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import Foundation

struct DeckModel: Codable {
    let id: String
    let name: String
    let user_id: String
    let battle_id: String
    let cards: [CardModel?]
}

extension DeckModel {
    enum CodingKeys: String, CodingKey {
        case id, name, user_id, battle_id, cards
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decodeIfPresent(String.self, forKey: .id) ?? ""
        name = try container.decodeIfPresent(String.self, forKey: .name) ?? ""
        user_id = try container.decodeIfPresent(String.self, forKey: .user_id) ?? ""
        battle_id = try container.decodeIfPresent(String.self, forKey: .battle_id) ?? ""

        cards = try container.decodeIfPresent(Array<CardModel>.self, forKey: .cards) ?? []
    }
}
