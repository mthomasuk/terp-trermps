//
//  CardView.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 15/06/2021.
//

import SwiftUI

func mapToImagePath(name: String) -> String {
    switch name.lowercased() {
        case "kazan tartar":
            return "kazan_tartar"
        case "tchu-ick":
            return "tchu_ick"
        case "var":
            return "vari"
        default:
           return name.lowercased()
    }
}

struct CardView: View {
    var card: CardModel
    var index: Int
    
    var body: some View {
        VStack {
            Image(mapToImagePath(name: card.name))
                .resizable()
                .scaledToFit()
                .frame(width: 190.0, height: 190.0)
            Text(card.type.uppercased()).fontWeight(.bold).font(.system(size: 16))
            Text(card.name.uppercased()).fontWeight(.bold).font(.system(size: 18))
            VStack {
                HStack {
                    Text("Strength").font(.system(size: 14))
                    Spacer()
                    Text("\(card.strength)").font(.system(size: 14))
                }
                HStack {
                    Text("Skill").font(.system(size: 14))
                    Spacer()
                    Text("\(card.skill)").font(.system(size: 14))
                }
                HStack {
                    Text("Magical Force").font(.system(size: 14))
                    Spacer()
                    Text("\(card.magical_force)").font(.system(size: 14))
                }
                HStack {
                    Text("Weapons").font(.system(size: 14))
                    Spacer()
                    Text("\(card.weapons)").font(.system(size: 14))
                }
                HStack {
                    Text("Power").font(.system(size: 14))
                    Spacer()
                    Text("\(card.power)").font(.system(size: 14))
                }
            }.padding(10)
        }
        .frame(width: 200.0, height: 352.0)
        .padding(5)
        .background(Color.white)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color(red: 222/255, green: 222/255, blue: 222/255), lineWidth: 1)
        )
        .offset(x: CGFloat(index * -5), y: 0)

    }
}
