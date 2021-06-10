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

    private func loadBattle() {
        getBattleById(
            battleId: battleId,
            completion: {
                (result: BattleModel?, error: Error?) -> () in
                if error != nil {
                    loadError = error
                } else {
                    battle = result
                }
            }
        )
    }

    var body: some View {
        NavigationView {
            if loadError == nil {
                BattleView(battle: battle, user: user).onAppear(perform: loadBattle)
            } else {
                ErrorView(error: loadError!)
            }
        }
    }
}


