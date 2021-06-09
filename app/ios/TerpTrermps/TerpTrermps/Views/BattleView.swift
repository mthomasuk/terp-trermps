//
//  BattleView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct BattleView: View {
    let user: UserModel = retriveLoggedInUser()!
    
    var battleId: String

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    VStack(alignment: .center) {
                        Text("Share this link to join the battle:").padding(.vertical, 10)
                        Link("terp-trermps://battle/\(battleId)", destination: URL(string: "terp-trermps://battle/\(battleId)")!)
                            .font(.footnote)
                            .multilineTextAlignment(.center)
                    }.padding(10)
                    VStack {
                        Text("Waiting for the battle to start")
                    }.padding(.vertical, 10)
                    LogOutButton()
                }
            }
        }
    }
}

