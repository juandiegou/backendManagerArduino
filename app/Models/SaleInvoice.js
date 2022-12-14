/* eslint-disable no-param-reassign */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const ProductSale = use('App/Models/ProductSale');
const Database = use('Database');
const User = use('App/Components/User');

const CryptoJS = require('crypto-js');

class SaleInvoice extends Model {

  static boot() {
    super.boot();
    this.addTrait('@provider:Lucid/SoftDeletes');

    this.addHook('beforeCreate', async (invoice) => {
      // eslint-disable-next-line no-param-reassign


      if (invoice.professional_id) {
        const sale = await this.query().where({ professional_id: invoice.professional_id }).orderBy(Database.raw(`CAST(invoice_code as SIGNED)`), 'desc').first();

        invoice.invoice_code = sale ? parseInt(sale.invoice_code) + 1 : 1;
      }
    });

    this.addHook('afterFind', async (invoice) => {

      // const query = await ProductSale
      //   .query()
      //   .innerJoin('product_variations', 'product_variations.id', 'product_sales.product_variation_id')
      //   .innerJoin('products', 'products.id', 'product_variations.product_id')
      //   .select(Database.raw(`sum(quantity*(unit_price-discount)) as total,
      //   sum(quantity * (unit_price - discount) * (iva / 100)) as iva,
      //     sum(discount * quantity) as discount`))
      //   .first();
      // // invoice.iva = query.toJSON().iva;
      // invoice.discount = query.toJSON().discount;
      // invoice.price_total = query.toJSON().total;
    });
  }

  static get hidden() {
    return ['professional_id'];
  }

  products() {
    return this.hasMany('App/Models/ProductSale');
  }

  transactions() {
    return this.hasMany('App/Models/Transaction');
  }

  client() {
    return this.belongsTo('App/Models/Client', 'user_id', 'id');
  }

  seller() {
    return this.belongsTo('App/Models/Professional', 'sold_by', 'id');
  }

  account() {
    return this.belongsTo('App/Models/Account', 'account_id', 'id');
  }

  setting() {
    return this.belongsTo('App/Models/SettignSso', 'professional_id', 'professional_id');
  }


  static allInvoices({
    page,
    perPage,
    code,
    professionalId,
    orderBy = 'created_at',
    order = 'desc',
    collect
  }) {

    const query = this.query()
      .where({
        professional_id: professionalId,
      })
      .with('products')
      .with('client')
      .orderBy(orderBy, order)
      .select(Database.raw(`*,(select
        sum(quantity*(unit_price-discount))
      from product_sales
        where sale_invoice_id =sale_invoices.id) as total,
      (select
        sum(quantity*discount)
      from product_sales
        where sale_invoice_id =sale_invoices.id) as discount`));

    if (code) {
      query.where({ invoice_code: code });
    }
    if (collect) {
      query.where('to_collect', '>', '0');
    }

    let invoices;
    if (page) {
      invoices = query.paginate(page, perPage);
    } else {
      invoices = query.fetch();
    }
    return invoices;
  }

  static async getInvoice(id, professional_id) {
    const invoice = await this.query()
      .where({ invoice_code: id, professional_id })
      .with('client')
      .with('seller')
      .with('account')
      .with('transactions', (builder) => {
        builder.with('account', (x) => {
          x.select('name', 'id')
        })
      })
      .with('products', (builder) => {
        builder
          .innerJoin('product_variations', 'product_variations.id', 'product_sales.product_variation_id')
          .innerJoin('products', 'products.id', 'product_variations.product_id')
          .leftJoin('taxes', 'taxes.id', 'products.tax_id')
          .select(
            'product_sales.id as product_sale_id',
            'taxes.id',
            'products.tax_id',
            'taxes.percentage',
            'product_sales.sale_invoice_id',
            'product_sales.unit_price',
            'product_sales.description',
            Database.raw('(product_sales.unit_price* product_sales.quantity) as price'),
            'product_sales.quantity',
            Database.raw('(product_sales.discount* product_sales.quantity) as discount'),
            'product_sales.product_variation_id',
            'product_variations.name as variation_name',
            'product_variations.product_id',
            'products.name as product_name',
            Database.raw(`
          (select image from product_images 
            where product_id = products.id limit 1) as image
          `),
          );
      })
      .select(Database.raw(`*,(select
        sum(quantity*(unit_price))
      from product_sales
        where sale_invoice_id =sale_invoices.id) as sub_total,
        ((select
          sum(quantity*(unit_price-discount))
        from product_sales
          where sale_invoice_id =sale_invoices.id)) as total,
      (select
        sum(quantity*discount)
      from product_sales
        where sale_invoice_id = sale_invoices.id) as total_discount`)
      )
      .first();

    // const address = await User.getUs(invoice.user_address_id);

    // invoice.user = address;
    return invoice;
  }

  static get computed() {
    return ['public_id'];
  }

  getPublicId({ id }) {

    const ciphertext = CryptoJS.AES.encrypt(id.toString(), 'd0gt0r2oft4r3').toString();

    return ciphertext;
  }

  static async getPublicInvoice(id) {
    const invoice = await this.query()
      .where({ id: id })
      .with('client')
      .with('account')
      .with('setting', (builder) => {
        builder.select('mercadopago_public_key', 'professional_id', 'mercadopago_access_token')
      })
      .with('transactions', (builder) => {
        builder.with('account', (x) => {
          x.select('name', 'id')
        })
      })
      .with('products', (builder) => {
        builder
          .innerJoin('product_variations', 'product_variations.id', 'product_sales.product_variation_id')
          .innerJoin('products', 'products.id', 'product_variations.product_id')
          .leftJoin('taxes', 'taxes.id', 'products.tax_id')
          .select(
            'product_sales.id as product_sale_id',
            'taxes.id',
            'products.tax_id',
            'taxes.percentage',
            'product_sales.sale_invoice_id',
            'product_sales.unit_price',
            'product_sales.description',
            Database.raw('(product_sales.unit_price* product_sales.quantity) as price'),
            'product_sales.quantity',
            Database.raw('(product_sales.discount* product_sales.quantity) as discount'),
            'product_sales.product_variation_id',
            'product_variations.name as variation_name',
            'product_variations.product_id',
            'products.name as product_name',
            Database.raw(`
          (select image from product_images 
            where product_id = products.id limit 1) as image
          `),
          );
      })
      .select(Database.raw(`*,(select
        sum(quantity*(unit_price))
      from product_sales
        where sale_invoice_id =sale_invoices.id) as sub_total,
        ((select
          sum(quantity*(unit_price-discount))
        from product_sales
          where sale_invoice_id =sale_invoices.id)) as total,
      (select
        sum(quantity*discount)
      from product_sales
        where sale_invoice_id = sale_invoices.id) as total_discount`)
      )
      .first();

    return invoice;
  }
}

module.exports = SaleInvoice;
