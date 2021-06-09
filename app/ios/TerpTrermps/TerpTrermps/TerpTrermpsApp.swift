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
                    scheme.localizedCaseInsensitiveCompare("com.myApp") == .orderedSame,

                    let view = url.host {
                       var parameters: [String: String] = [:]
                       URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems?.forEach {
                           parameters[$0.name] = $0.value
                       }

                        // TODO: redirect(to: view, with: parameters)
                        print(view)
                    }
                })
            } else {
                LoginView()
            }
        }
    }
}
