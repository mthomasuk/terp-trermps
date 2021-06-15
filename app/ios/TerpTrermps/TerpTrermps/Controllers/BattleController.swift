//
//  BattleController.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import SwiftUI

struct BattleController: View {
    var battleId: String
    
    
    @State var loadError: Error?
    
    @State var user: UserModel? = retriveLoggedInUser()

    @StateObject private var battle: BattleModel = BattleModel()
    @StateObject private var ws: WebsocketController = WebsocketController()
    
    func refetch() {
        getBattleById(
            battleId: battleId,
            completion: {
                (result: BattleStruct?, error: Error?) -> () in
                if error != nil {
                    return loadError = error
                } else {
                    battle.data = result
                }
            }
        )
    }

    private func onAppear() {
        getBattleById(
            battleId: battleId,
            completion: {
                (result: BattleStruct?, error: Error?) -> () in
                if error != nil {
                    return loadError = error
                } else {
                    DispatchQueue.main.async {
                        battle.data = result
                    }

                    ws.connect(battleId: battleId)
                    
                    let battleHasStarted: Bool = ws.battleHasStarted || result!.started_at != ""
                    
                    if !battleHasStarted {
                        joinBattle(
                            battleId: battleId,
                            completion: {
                                (error: Error?) -> () in
                                if error != nil {
                                    return loadError = error
                                }
                            }
                        )
                    }
                }
            }
        )
    }
    
    private func onDisappear() {
        ws.disconnect()
    }

    var body: some View {
        NavigationView {
            if loadError == nil {
                BattleView(
                    battle: battle,
                    user: user,
                    refetch: refetch
                )
                .onAppear(perform: onAppear)
                .onDisappear(perform: onDisappear)
                .environmentObject(ws)
            } else {
                ErrorView(error: loadError!)
            }
        }
    }
}


