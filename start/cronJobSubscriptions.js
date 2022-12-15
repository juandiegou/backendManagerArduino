const cron = require("node-cron");
const Env = use("Env");
const Database = use("Database");
const Subscription = use("App/Models/Subscription");
const SaleInvoice = use("App/Models/SaleInvoice");
const ProductSale = use("App/Models/ProductSale");
const ProductVariation = use("App/Models/ProductVariation");
const moment = require("moment");
require("moment/locale/es");

const jobSubscriptions = async () => {
  const subscriptions = await Subscription.query()
    .where("is_active", true)
    .andWhere(Database.raw(`DATE(next_payment) = DATE(NOW())`))
    .fetch();

  subscriptions.toJSON().forEach(async (item) => {
    let product = await ProductVariation.find(item.product_variation_id);
    let nextPaymentDate = moment(item.next_payment)
      .add(item.frequency, "month")
      .format("YYYY-MM-DD");
    let currentRecurrence = item.current_recurrence + 1;

    let newInvoice = await SaleInvoice.create({
      to_collect: product.price_sale,
      user_id: item.client_id,
      professional_id: item.professional_id,
    });

    await ProductSale.create({
      unit_price: product.price_sale,
      quantity: 1,
      discount: 0,
      product_variation_id: item.product_variation_id,
      sale_invoice_id: newInvoice.id,
      product_id: product.product_id,
      professional_id: item.professional_id,
    });

    await Subscription.query()
      .where({ id: item.id })
      .update({
        next_payment: nextPaymentDate,
        current_recurrence: currentRecurrence,
        is_active: currentRecurrence !== item.recurrence,
      });
  });
};
cron.schedule("0 1 * * *", jobSubscriptions);
cron.schedule("0 5 * * *", jobSubscriptions);
