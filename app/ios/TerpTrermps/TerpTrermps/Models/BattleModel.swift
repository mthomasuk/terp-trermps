//
//  User.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import Foundation

struct BattleModel: Decodable {
    let id: String
    let started_at: String?
    let winner: String?
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
