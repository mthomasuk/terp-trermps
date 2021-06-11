//
//  SocketMessageModel.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 11/06/2021.
//

import Foundation

struct SocketMessageModel: Decodable, Hashable {
    let type: Constants.MessageTypes
    let body: String
    let battle_id: String
    let user_id: String
    let name: String
    let card: String
    let attribute: String
}

extension SocketMessageModel {
    enum CodingKeys: String, CodingKey {
        case type, body, battle_id, user_id, name, card, attribute
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        type = try Constants.MessageTypes(rawValue: container.decode(String.self, forKey: .type))!
        body = try container.decodeIfPresent(String.self, forKey: .body) ?? ""
        battle_id = try container.decodeIfPresent(String.self, forKey: .battle_id) ?? ""
        user_id = try container.decodeIfPresent(String.self, forKey: .user_id) ?? ""
        name = try container.decodeIfPresent(String.self, forKey: .name) ?? ""
        card = try container.decodeIfPresent(String.self, forKey: .card) ?? ""
        attribute = try container.decodeIfPresent(String.self, forKey: .attribute) ?? ""
    }
}
