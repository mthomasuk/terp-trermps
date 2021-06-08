//
//  HomeView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct HomeView: View {
    let loggedInUser = UserDefaults.standard.string(forKey: "user")

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    VStack(alignment: .center) {
                        Logo()
                    }
                    VStack(alignment: .center) {
                        Text((loggedInUser ?? "").isEmpty ? "" : loggedInUser!)
                    }
                    LogOutButton()
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarHidden(true) 
    }
}

