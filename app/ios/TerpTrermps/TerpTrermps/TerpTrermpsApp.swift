//
//  TerpTrermpsApp.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

@main
struct TerpTrermpsApp: App {
    @AppStorage("user") var loggedInUser: String = ""
    
    var body: some Scene {
        WindowGroup {
            if loggedInUser != "" {
                HomeView()
            } else {
                LoginView()
            }
        }
    }
}
