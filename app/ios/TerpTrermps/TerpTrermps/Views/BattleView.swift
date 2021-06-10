//
//  BattleView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct BattleView: View {
    var battle: BattleModel?
    var user: UserModel?
    
    var currentRound: RoundModel? {
        return self.battle!.rounds[0]
    }
    
    var isLeader: Bool {
        if self.currentRound != nil {
            return self.currentRound!.leader == self.user!.id
        }
        return false
    }
    
    var userDeck: DeckModel? {
        var deck: DeckModel?
        for (_, d) in self.battle!.decks.enumerated() {
            if self.user != nil && d != nil {
                if d!.user_id == self.user!.id {
                    deck = d
                }
            }
        }
        return deck
    }

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
                            if isLeader {
                                Text("\(user!.name) is the round leader")
                            }
                            Text("Waiting for the battle to start").font(.footnote)
                        }.padding(.vertical, 10)
                    }
                    Spacer()
                    LogOutButton()
                }
            }
        }
    }
}

