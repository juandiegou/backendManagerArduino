/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use('Database');
const User = use('App/Components/User');

class AppInvoice extends Model {

  state() {
    return this.belongsTo('App/Models/AppSaleState');
  }

  products() {
    return this.hasMany('App/Models/AppSale');
  }
  payment(){
    return this.belongsTo('App/Models/Payment','reference_code', 'reference_sale')
  }

  static async allInvoice({
    page,
    perPage,
    state,
    professional_id,
  }) {

    const query = this.query()
      .where({ app_sale_state_id: state , professional_id })
      .with('state')
      .orderBy('created_at', 'desc')
      .select(Database.raw(`*,(select
        sum(quantity*(unit_price-discount))
      from app_sales
        where app_invoice_id =app_invoices.id) as sub_total,
        ((select
          sum(quantity*(unit_price-discount))
        from app_sales
          where app_invoice_id =app_invoices.id)+delivery) as total,
      (select
        sum(quantity*discount)
      from app_sales
        where app_invoice_id =app_invoices.id) as discount`));

    let invoices;
    if (page) {
      invoices = await query.paginate(page, perPage);
    } else {
      invoices = await query.fetch();
    }
    return invoices;
  }


  static async getInvoice(id) {
    const invoice = await this.query()
      .where({ id })
      .with('payment')
      .with('products', (builder) => {
        builder
          .innerJoin('product_variations', 'product_variations.id', 'app_sales.product_variation_id')
          .innerJoin('products', 'products.id', 'product_variations.product_id').select(
            'app_sales.app_invoice_id',
            Database.raw('(app_sales.unit_price* app_sales.quantity) as price'),
            'app_sales.quantity',
            Database.raw('(app_sales.discount* app_sales.quantity) as discount'),
            'app_sales.product_variation_id',
            'product_variations.name as variation_name',
            'product_variations.product_id',
            'product_variations.code',
            'products.name as product_name',
            Database.raw(`
          (select image from product_images 
            where product_id = products.id limit 1) as image
          `),
          );
      })
      .with('state')
      .select(Database.raw(`*,(select
        sum(quantity*(unit_price-discount))
      from app_sales
        where app_invoice_id =app_invoices.id) as sub_total,
        ((select
          sum(quantity*(unit_price-discount))
        from app_sales
          where app_invoice_id =app_invoices.id)+delivery) as total,
      (select
        sum(quantity*discount)
      from app_sales
        where app_invoice_id =app_invoices.id) as discount`))
      .first();

    const address = await User.getUserAddress(invoice.user_address_id);
    invoice.user = address;
    return invoice;
  }

}

module.exports = AppInvoice;
