module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-react',
    '@babel/typescript',
  ],
  plugins: [['@babel/plugin-proposal-class-properties', {loose: true}]],
}
