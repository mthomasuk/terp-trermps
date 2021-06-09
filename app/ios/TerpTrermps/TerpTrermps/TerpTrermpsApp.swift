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
                HomeView().onOpenURL(perform: { url in
                    if let scheme = url.scheme,
                    scheme.localizedCaseInsensitiveCompare("terp-trermps") == .orderedSame,

                    let view = url.host {
                        // TODO: redirect(to: view, with: parameters)
                        if view == "battle" {
                            print(view, url.path)
                        }
                    }
                })
            } else {
                LoginView()
            }
        }
    }
}
