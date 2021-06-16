//
//  BattleView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct BattleView: View {
    @EnvironmentObject var ws: WebsocketController
    @ObservedObject var battle: BattleModel
    
    var user: UserModel?
    var refetch: () -> ()
    
    var currentRound: RoundModel? {
        return self.battle.data!.rounds[0]
    }
    
    var isLeader: Bool {
        return self.currentRound!.leader == self.user!.id
    }
    
    var userDeck: DeckModel? {
        var deck: DeckModel?

        for (_, d) in self.battle.data!.decks.enumerated() {
            if d!.user_id == self.user!.id {
                deck = d
            }
        }
        return deck
    }
    
    var combatants: [String] {
        let f = self.ws.messages.map{ $0.name }
        let d = self.battle.data!.decks.map{ $0!.name }
        
        return Array(Set(f + d))
    }
    
    var battleInProgress: Bool {
        if self.battle.data!.started_at == "" {
            if self.ws.battleHasStarted {
                self.refetch()
            }
            return self.ws.battleHasStarted
        }
        return self.battle.data!.started_at != ""
    }
    
    var canStartBattle: Bool {
        return !self.ws.battleHasStarted && battle.data!.started_at == "" && combatants.count > 1
    }

    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    if battle.data != nil {
                        VStack(alignment: .center) {
                            Text("Share this link to join the battle:")
                                .font(.footnote)
                                .padding(.vertical, 10)
                            Link("terp-trermps://battle/\(battle.data!.id)", destination: URL(string: "terp-trermps://battle/\(battle.data!.id)")!)
                                .font(.footnote)
                                .multilineTextAlignment(.center)
                        }.padding(10)
                        VStack {
                            BattleStatusView(
                                isLeader: isLeader,
                                battleInProgress: battleInProgress,
                                selectedAttribute: currentRound!.attribute
                            )
                        }.padding(.vertical, 10)
                        if !battleInProgress {
                            VStack {
                                CombatantsView(
                                    combatants: combatants
                                )
                            }.padding(20)
                        }
                        if canStartBattle {
                            VStack {
                                StartBattleButton(
                                    battleId: battle.data!.id,
                                    refetch: refetch
                                )
                            }.padding(20)
                        }
                        if battleInProgress {
                            VStack {
                                CardsView(
                                    isLeader: isLeader,
                                    roundId: currentRound!.id,
                                    selectedAttribute: currentRound!.attribute,
                                    cards: userDeck!.cards
                                )
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

