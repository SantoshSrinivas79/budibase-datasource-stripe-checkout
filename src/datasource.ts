import { IntegrationBase } from "@budibase/types"
import Stripe from "stripe"

class CustomIntegration implements IntegrationBase {
  private readonly stripe: Stripe

  constructor(config: { apiKey: string; }) {
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2022-08-01'
    })
  }

  async create(query: { cancelUrl: string, successUrl: string, mode: Stripe.Checkout.SessionCreateParams.Mode, additionalParams: string }) {
    const additionalParams = query.additionalParams ? JSON.parse(query.additionalParams) : undefined
    return await this.stripe.checkout.sessions.create(
      {
        ...additionalParams,
        success_url: query.successUrl,
        cancel_url: query.cancelUrl,
        mode: query.mode || undefined
      }
    )
  }

  async read(query: { id: string }) {
    return await this.stripe.checkout.sessions.retrieve(query.id)
  }

  async list(query: { json: object }) {
    return await this.stripe.checkout.sessions.list(query.json)
  }

  async delete(query: { id: string }) {
    return await this.stripe.checkout.sessions.expire(query.id)
  }

  async listLineItems(query: { id: string, endingBefore: string, startingAfter: string, limit: number }) {
    return await this.stripe.checkout.sessions.listLineItems(query.id, {
      ending_before: query.endingBefore || undefined,
      starting_after: query.startingAfter || undefined,
      limit: query.limit || undefined
    })
  }
}

export default CustomIntegration