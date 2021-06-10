//
//  BattleController.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//

import SwiftUI

struct BattleController: View {
    var battleId: String
    
    @State var battle: BattleModel?
    @State var loadError: Error?
    
    @State var user: UserModel? = retriveLoggedInUser()

    @StateObject private var ws: WebsocketController = WebsocketController()

    private func loadBattle() {
        getBattleById(
            battleId: battleId,
            completion: {
                (result: BattleModel?, error: Error?) -> () in
                if error != nil {
                    loadError = error
                } else {
                    battle = result
                    ws.connect(battleId: battleId)
                }
            }
        )
    }
    
    private func disconnect() {
        ws.disconnect()
    }

    var body: some View {
        NavigationView {
            if loadError == nil {
                BattleView(battle: battle, user: user)
                    .onAppear(perform: loadBattle)
                    .onDisappear(perform: disconnect)
                    .environmentObject(ws)
            } else {
                ErrorView(error: loadError!)
            }
        }
    }
}


