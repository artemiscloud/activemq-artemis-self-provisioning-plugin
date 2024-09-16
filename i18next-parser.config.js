module.exports = {
  createOldCatalogs: false,
  // Save the \_old files

  defaultNamespace: 'plugin__activemq-artemis-self-provisioning-plugin',
  // Default namespace used in your i18next config

  keySeparator: false,
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  locales: ['en'],
  // An array of the locales in your applications

  namespaceSeparator: '~',
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  reactNamespace: false,
  // For react file, extract the defaultNamespace - https://react.i18next.com/components/translate-hoc.html
  // Ignored when parsing a `.jsx` file and namespace is extracted from that file.

  defaultValue: function (_, __, key, ___) {
    // The `useKeysAsDefaultValues` option is deprecated in favor of `defaultValue` option function arguments.
    // The `key` is used to set default value.
    return key;
  },
};
