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

func retriveLoggedInUser() -> UserModel? {
    let JSON = UserDefaults.standard.string(forKey: "user")
    if JSON != nil {
        let data = JSON?.data(using: .utf8)
        let user: UserModel = try! JSONDecoder().decode(UserModel.self, from: data!)
        return user
    }
    return nil
}
