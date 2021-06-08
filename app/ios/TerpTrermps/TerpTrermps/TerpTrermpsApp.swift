//
//  TerpTrermpsApp.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

@main
struct TerpTrermpsApp: App {
    var loggedInUser = UserDefaults.standard.string(forKey: "user")
    
    var body: some Scene {
        WindowGroup {
            if loggedInUser != nil {
                HomeView()
            } else {
                LoginView()
            }
        }
    }
}
