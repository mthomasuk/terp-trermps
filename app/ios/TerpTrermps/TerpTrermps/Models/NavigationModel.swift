//
//  NavigationModel.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 09/06/2021.
//

import Foundation

class NavigationModelController: ObservableObject {
    @Published var route: String
    @Published var param: String
    @Published var prevRoute: String
    
    init() {
        self.route = "login"
        self.param = ""
        self.prevRoute = ""
    }
}
