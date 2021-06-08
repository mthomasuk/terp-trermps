//
//  ContentView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 08/06/2021.
//

import SwiftUI

struct LoginView: View {    
    var body: some View {
        NavigationView {
            ZStack {
                Color(red: 255/255, green: 255/255, blue: 157/255).ignoresSafeArea()
                VStack {
                    VStack(alignment: .center) {
                        Logo()
                    }
                    VStack(alignment: .leading) {
                        Text("If you're new, just make a username and password up!").font(.system(size: 12)).padding(.vertical, 2)
                        Text("Returning players can retrieve their scores/re-enter games midway through").font(.system(size: 12)).padding(.vertical, 2)
                    }.padding(.horizontal, 20)
                    VStack(alignment: .leading) {
                        LoginForm()
                    }.padding(.horizontal, 30).padding(.vertical, 20)
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarHidden(true) 
    }
}
