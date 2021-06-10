//
//  BattleView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct BattleDisplay: View {
    var battle: BattleModel?

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    if battle != nil {
                        VStack(alignment: .center) {
                            Text("Share this link to join the battle:").padding(.vertical, 10)
                            Link("terp-trermps://battle/\(battle!.id)", destination: URL(string: "terp-trermps://battle/\(battle!.id)")!)
                                .font(.footnote)
                                .multilineTextAlignment(.center)
                        }.padding(10)
                        VStack {
                            Text("Waiting for the battle to start")
                        }.padding(.vertical, 10)
                    }
                    Spacer()
                    LogOutButton()
                }
            }
        }
    }
}

struct BattleView: View {
    var battleId: String
    
    @State var battle: BattleModel?

    private func loadBattle() {
        getBattleById(
            battleId: battleId,
            completion: {
                (result: BattleModel?, error: Error?) -> () in
                if error != nil {
                    print(error!)
                } else {
                    battle = result
                }
            }
        )
    }

    var body: some View {
        NavigationView {
            BattleDisplay(battle: battle).onAppear(perform: loadBattle)
        }
    }
}

