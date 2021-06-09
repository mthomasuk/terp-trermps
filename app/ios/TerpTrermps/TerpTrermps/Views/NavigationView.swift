//
//  NavigationView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import SwiftUI

struct NavView: View {
    @EnvironmentObject var navController: NavigationModelController

    var body: some View {
        NavigationView {
            if self.navController.route == "login" {
                LoginView()
            } else if self.navController.route == "home" {
                HomeView()
            } else if self.navController.route == "battle" {
                BattleView(battleId: String(describing: self.navController.param))
            } else {
                LoginView()
            }
        }
    }
}
