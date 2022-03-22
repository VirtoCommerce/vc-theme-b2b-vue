import SeoUrl from "@core/seo-routes.enum";

export default {
  header: {
    main: [
      { id: "home", title: "shared.layout.header.menu.home", url: "/" },
      {
        id: "catalog",
        title: "shared.layout.header.menu.all_products",
        children: [
          {
            title: "shared.layout.header.menu.all_products_children.carriage_bolts",
            url: `/${SeoUrl.Catalog}/carriage-bolts`,
          },
          {
            title: "shared.layout.header.menu.all_products_children.flange_bolts",
            url: `/${SeoUrl.Catalog}/flange-bolts`,
          },
          {
            title: "shared.layout.header.menu.all_products_children.laser_printers",
            url: `/${SeoUrl.Catalog}/multifunction-printers`,
          },
          {
            title: "shared.layout.header.menu.all_products_children.inkjet_printers",
            url: `/${SeoUrl.Catalog}/all-in-one`,
          },
        ],
      },
      { id: "bulk", title: "shared.layout.header.menu.bulk", url: "/bulk-order" },
      { id: "checkout", title: "shared.layout.header.menu.cart", url: "/checkout" },
      { id: "contact", title: "shared.layout.header.menu.contact_us", url: "/contact" },
    ],
    mobile_account: [
      {
        id: "my_account",
        title: "shared.layout.header.menu.my_account",
        url: "/",
        children: [
          { title: "shared.layout.header.mobile.account_menu.dashboard", url: "/account/dashboard" },
          { title: "shared.layout.header.mobile.account_menu.profile", url: "/account/profile" },
          { title: "shared.layout.header.mobile.account_menu.addresses", url: "/account/addresses" },
          { title: "shared.layout.header.mobile.account_menu.orders", url: "/account/orders" },
          { title: "shared.layout.header.mobile.account_menu.your_list", url: "/account/lists" },
          { title: "shared.layout.header.mobile.account_menu.checkout_defaults", url: "/account/checkout-defaults" },
        ],
      },
    ],
  },
  footer: [],
};
