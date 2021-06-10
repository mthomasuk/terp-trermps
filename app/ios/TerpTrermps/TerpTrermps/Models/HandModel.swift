//
//  HandModel.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import Foundation

struct HandModel: Decodable {
    let id: String
    let deck_id: String
    let round_id: String
    let card_id: String
    let value: Int
    let name: String
    let user_id: String
}

extension HandModel {
    enum CodingKeys: String, CodingKey {
        case id, deck_id, round_id, card_id, value, name, user_id
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decodeIfPresent(String.self, forKey: .id) ?? ""
        deck_id = try container.decodeIfPresent(String.self, forKey: .deck_id) ?? ""
        round_id = try container.decodeIfPresent(String.self, forKey: .round_id) ?? ""
        card_id = try container.decodeIfPresent(String.self, forKey: .card_id) ?? ""
        value = try container.decodeIfPresent(Int.self, forKey: .value) ?? 0
        name = try container.decodeIfPresent(String.self, forKey: .name) ?? ""
        user_id = try container.decodeIfPresent(String.self, forKey: .user_id) ?? ""
    }
}
