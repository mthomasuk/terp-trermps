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
    
    @StateObject private var navController = NavigationModelController()

    
    var body: some Scene {
        WindowGroup {
            NavView()
                .environmentObject(navController)
                .onAppear {
                    if loggedInUser != "" {
                        self.navController.route = "home"
                    }
                }
                .onOpenURL(perform: { url in
                    navController.route = url.host!
                    navController.param = url.path.replacingOccurrences(of: "/", with: "")
                }
            )
        }
    }
}
