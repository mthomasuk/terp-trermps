//
//  User.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import Foundation

struct BattleModel: Decodable {
    let id: String
    let started_at: String
    let winner: String
    let decks: [DeckModel?]
    let rounds: [RoundModel?]
}

extension BattleModel {
    enum CodingKeys: String, CodingKey {
        case id, started_at, winner, decks, rounds
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decodeIfPresent(String.self, forKey: .id) ?? ""
        started_at = try container.decodeIfPresent(String.self, forKey: .started_at) ?? ""
        winner = try container.decodeIfPresent(String.self, forKey: .winner) ?? ""
        
        decks = try container.decodeIfPresent(Array<DeckModel>.self, forKey: .decks) ?? []
        rounds = try container.decodeIfPresent(Array<RoundModel>.self, forKey: .rounds) ?? []
    }
}

func createBattle(completion: @escaping (String?, Error?) -> ()) {
    let url = URL(string: "http://localhost:4001/api/battle/new")!
    var request = URLRequest(url: url)
    
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    
    let session = URLSession.shared
    session.dataTask(with: request) { (data, response, error) -> Void in
        if error != nil {
            return completion(nil, error)
        } else if let data = data {
            let JSONObj = try? JSONSerialization.jsonObject(with: data, options: [])
            if let dictionary = JSONObj as? [String: Any] {
                return completion(dictionary["id"] as? String, nil)
            }
        } else {
            print("Something has gone horrifically wrong")
            return completion(nil, nil)
        }
    }.resume()
}

func getBattleById(battleId: String, completion: @escaping (BattleModel?, Error?) -> ()) {
    let url = URL(string: "http://localhost:4001/api/battle/\(battleId)")!
    var request = URLRequest(url: url)
    
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "GET"
    
    let session = URLSession.shared
    session.dataTask(with: request) { (data, response, error) -> Void in
        if error != nil {
            return completion(nil, error)
        } else if let data = data {
            let decoder = JSONDecoder()
            do {
                let battle = try decoder.decode(BattleModel.self, from: data)
                return completion(battle, nil)
            } catch {
                return completion(nil, error)
            }
        } else {
            print("Something has gone horrifically wrong")
            return completion(nil, nil)
        }
    }.resume()
}

func joinBattle(battleId: String, completion: @escaping (Error?) -> ()) {
    let url = URL(string: "http://localhost:4001/api/battle/\(battleId)")!
    var request = URLRequest(url: url)
    
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    
    let session = URLSession.shared
    session.dataTask(with: request) { (data, response, error) -> Void in
        if error != nil {
            return completion(error)
        } else if data != nil {
            return completion(nil)
        } else {
            print("Something has gone horrifically wrong")
            return completion(nil)
        }
    }.resume()
}

func startBattle(battleId: String, completion: @escaping (Error?) -> ()) {
    let url = URL(string: "http://localhost:4001/api/battle/\(battleId)/start")!
    var request = URLRequest(url: url)
    
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    
    let session = URLSession.shared
    session.dataTask(with: request) { (data, response, error) -> Void in
        if error != nil {
            return completion(error)
        } else if data != nil {
            return completion(nil)
        } else {
            print("Something has gone horrifically wrong")
            return completion(nil)
        }
    }.resume()
}
