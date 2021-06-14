//
//  BattleView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct BattleView: View {
    @EnvironmentObject var ws: WebsocketController
    
    var battle: BattleModel?
    var user: UserModel?
    var refetch: () -> ()
    
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
    
    var combatants: [String] {
        let f = self.ws.messages.map{ $0.name }
        let d = self.battle!.decks.map{ $0!.name }
        
        return Array(Set(f + d))
    }
    
    var battleInProgress: Bool {
        return self.ws.battleHasStarted || battle!.started_at != ""
    }
    
    var canStartBattle: Bool {
        return !self.ws.battleHasStarted && battle!.started_at == "" && combatants.count > 1
    }

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    if battle != nil {
                        VStack(alignment: .center) {
                            Text("Share this link to join the battle:")
                                .font(.footnote)
                                .padding(.vertical, 10)
                            Link("terp-trermps://battle/\(battle!.id)", destination: URL(string: "terp-trermps://battle/\(battle!.id)")!)
                                .font(.footnote)
                                .multilineTextAlignment(.center)
                        }.padding(10)
                        VStack {
                            BattleStatusView(
                                isLeader: isLeader,
                                battleInProgress: battleInProgress,
                                selectedAttribute: currentRound != nil ? currentRound!.attribute : ""
                            )
                        }.padding(.vertical, 10)
                        if !battleInProgress {
                            VStack {
                                CombatantsView(combatants: combatants)
                            }.padding(20)
                        }
                        if canStartBattle {
                            VStack {
                                StartBattleButton(battleId: battle!.id, refetch: refetch)
                            }.padding(20)
                        }
                    }
                    Spacer()
                    LogOutButton()
                }
            }
        }.navigationBarHidden(true) 
    }
}

