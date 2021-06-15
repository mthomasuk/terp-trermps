//
//  WebsocketController.swift
//  TerpTrermps
//
//  Created by Mark Thomas on 10/06/2021.
//
// Liberally borrowed from: https://frzi.medium.com/a-simple-chat-app-with-swiftui-and-websockets-or-swift-in-the-back-swift-in-the-front-78b34c3dc912

import Foundation

class WebsocketController: ObservableObject {
    @Published var messages: [SocketMessageModel] = []
    
    @Published var battleHasStarted: Bool = false
    @Published var battleHasEnded: Bool = false
    
    @Published var atttributeSelected: String = ""
    
    private var connection: URLSessionWebSocketTask?
    
    func connect(battleId: String) -> Void {
        let url = URL(string: "ws://localhost:4002/ws/\(battleId)")!
        
        connection = URLSession.shared.webSocketTask(with: url)
        connection?.receive(completionHandler: onReceive)
        connection?.resume()
        
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            self.connection?.sendPing{ error in
                if error != nil {
                    print(error!.localizedDescription)
                    timer.invalidate()
                }
            }
        }
    }
    
    private func onReceive(incoming: Result<URLSessionWebSocketTask.Message, Error>) {
        connection?.receive(completionHandler: onReceive)

        switch incoming {
            case .success(let message):
                onMessage(message: message)
            case .failure(let error):
                print("WS error: \(error)")
        }
    }
    
    private func onMessage(message: URLSessionWebSocketTask.Message) {
        switch message {
            case .string(let text):
                let parsed = self.decodeJSON(jsonString: text)
                if parsed != nil {
                    self.handleSocketMessage(msg: parsed!)
                }
            case .data(let data):
                print("WS received binary data: \(data)")
            @unknown default:
                print("WS being weird")
        }
    }
    
    private func decodeJSON(jsonString: String) -> SocketMessageModel? {
        let decoder = JSONDecoder()
        do {
            let data: Data = jsonString.data(using: String.Encoding.utf8)!
            let smm = try decoder.decode(SocketMessageModel.self, from: data)
            return smm
        } catch {
            return nil
        }
    }
    
    private func handleSocketMessage(msg: SocketMessageModel) {
        switch msg.type {
            case .USER_JOINED_BATTLE:
                DispatchQueue.main.async {
                    self.messages.append(msg)
                }
            case .BATTLE_START:
                DispatchQueue.main.async {
                    self.battleHasStarted = true
                    
                }
            case .BATTLE_END:
                DispatchQueue.main.async {
                    self.battleHasEnded = true
                }
            case .WINNING_HAND_PLAYED:
                print("WINNING HAND PLAYED")
            case .ROUND_ATTRIBUTE_SELECTED:
                DispatchQueue.main.async {
                    self.atttributeSelected = msg.attribute
                }
            case .ROUND_IS_A_DRAW:
                print("ROUND IS A DRAW")
        }
    }
    
    func send(message: String) -> Void {
        if connection != nil {
            let text = URLSessionWebSocketTask.Message.string(message)
            connection!.send(text) { error in
                if error != nil {
                    print(error!.localizedDescription)
                }
            }
        }
    }
    
    func disconnect() -> Void {
        if connection != nil {
            connection!.cancel()
        }
    }
    
    deinit {
        disconnect()
    }
}
