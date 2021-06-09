//
//  User.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import Foundation

struct UserModel: Decodable {
    let id: String
    let name: String
}

func logUserIn(username: String, password: String, completion: @escaping (Bool, Error?) -> ()) {
    UserDefaults.standard.removeObject(forKey: "user")
    
    let url = URL(string: "http://localhost:4001/api/login")!
    var request = URLRequest(url: url)
    
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["name": username, "password": password]
    let json = try? JSONSerialization.data(withJSONObject: body, options: [])
    
    request.httpMethod = "POST"
    request.httpBody = json;
    
    var JSONString: String = ""
    
    let session = URLSession.shared
    let task = session.dataTask(with: request) { (data, response, error) in
        if error != nil {
            completion(false, error)
        } else if let data = data {
            JSONString = String(data: data, encoding: String.Encoding.utf8)!
            if JSONString != "" {
                UserDefaults.standard.set(JSONString, forKey: "user")
                completion(true, nil)
            }
        } else {
            print("Something has gone horrifically wrong")
            completion(false, error)
        }
    }
        
    task.resume()
}

func logUserOut() -> Void {
    UserDefaults.standard.removeObject(forKey: "user")
}

func retriveLoggedInUser() -> UserModel? {
    let JSON = UserDefaults.standard.string(forKey: "user")
    if JSON != nil {
        let data = JSON?.data(using: .utf8)
        let user: UserModel = try! JSONDecoder().decode(UserModel.self, from: data!)
        return user
    }
    return nil
}
