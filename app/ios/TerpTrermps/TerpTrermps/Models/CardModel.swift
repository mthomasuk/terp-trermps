//
//  CardModel.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import Foundation

struct CardModel: Codable {
    let id: String
    let name: String
    let type: String
    let strength: Int
    let skill: Int
    let magical_force: Int
    let weapons: Int
    let power: Int
}

extension CardModel {
    enum CodingKeys: String, CodingKey {
        case id, name, type, strength, skill, magical_force, weapons, power
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decodeIfPresent(String.self, forKey: .id) ?? ""
        name = try container.decodeIfPresent(String.self, forKey: .name) ?? ""
        type = try container.decodeIfPresent(String.self, forKey: .type) ?? ""
        strength = try container.decodeIfPresent(Int.self, forKey: .strength) ?? 0
        skill = try container.decodeIfPresent(Int.self, forKey: .skill) ?? 0
        magical_force = try container.decodeIfPresent(Int.self, forKey: .magical_force) ?? 0
        weapons = try container.decodeIfPresent(Int.self, forKey: .weapons) ?? 0
        power = try container.decodeIfPresent(Int.self, forKey: .power) ?? 0
    }
}
