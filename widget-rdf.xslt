<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:usdl-core="http://www.linked-usdl.org/ns/usdl-core#"
                xmlns:foaf="http://xmlns.com/foaf/0.1/"
                xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
                xmlns:dcterms="http://purl.org/dc/terms/"
                xmlns:wire="http://wirecloud.conwet.fi.upm.es/ns/widget#"
                xmlns:vCard="http://www.w3.org/2006/vcard/ns#"
                xmlns:gr="http://purl.org/goodrelations/v1#">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="rdf:RDF">
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="wire:Operator/wire:displayName|wire:Widget/wire:displayName" /></title>
        <link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet"/>
        <style type="text/css">
          .container { background-color: #fff; border: 1px solid #ccc; margin-top: 1em; border-radius: 5px }
          body { background-color: #eee }
          footer { font-size: 11px }
        </style>
      </head>
      <body>
        <div class="container">
          <h2><xsl:value-of select="wire:Operator/wire:displayName|wire:Widget/wire:displayName" /></h2>
          <div>(internal name: <code><xsl:value-of select="wire:Operator/dcterms:title|wire:Widget/dcterms:title"/></code>)</div>

          <div class="row">
            <div class="col-md-4">
              <fieldset>
                <legend>Metadata</legend>
                <div>
                  <strong>Type: </strong>
                  <xsl:if test="wire:Operator">Operator</xsl:if>
                  <xsl:if test="wire:Widget">Widget</xsl:if>
                </div>
                <div>
                  <strong>Maintainer: </strong>
                  <xsl:value-of select="foaf:Person[@rdf:about='http://creatoruri/']/foaf:name"/> (<xsl:value-of select="gr:BusinessEntity[@rdf:about='http://vendoruri/']/foaf:name"/>)
                </div>
                <div>
                  <strong>Version: </strong>
                  <xsl:value-of select="wire:Operator/usdl-core:versionInfo|wire:Widget/usdl-core:versionInfo"/>
                </div>
              </fieldset>
            </div>

            <div class="col-md-4">
              <fieldset>
                <legend>Description</legend>
                <div><xsl:value-of select="wire:Operator/dcterms:description|wire:Widget/dcterms:description"/></div>
              </fieldset>
            </div>

            <div class="col-md-4">
              <fieldset>
                <legend>Endpoints &amp; Configuration</legend>
                <xsl:if test="wire:Operator/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasInputEndpoint|wire:Widget/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasInputEndpoint">
                  <div class="text-info">Incoming endpoints:</div>
                  <ul>
                    <xsl:apply-templates select="wire:Operator/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasInputEndpoint/wire:InputEndpoint|wire:Widget/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasInputEndpoint/wire:InputEndpoint"/>
                  </ul>
                </xsl:if>

                <xsl:if test="wire:Operator/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasOutputEndpoint|wire:Widget/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasOutputEndpoint">
                  <div class="text-info">Outgoing endpoints:</div>
                  <ul>
                    <xsl:apply-templates select="wire:Operator/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasOutputEndpoint/wire:OutputEndpoint|wire:Widget/wire:hasPlatformWiring/wire:PlatformWiring/wire:hasOutputEndpoint/wire:OutputEndpoint"/>
                  </ul>
                </xsl:if>

                <xsl:if test="wire:Operator/wire:hasPlatformPreference|wire:Widget/wire:hasPlatformPreference">
                  <div class="text-info">Configuration:</div>
                  <ul>
                    <xsl:apply-templates select="wire:Operator/wire:hasPlatformPreference/wire:PlatformPreference|wire:Widget/wire:hasPlatformPreference/wire:PlatformPreference"/>
                  </ul>
                </xsl:if>
              </fieldset>
            </div>
          </div>

          <footer class="hidden-print">
            This file was generated automatically. Do not modify it by hand.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="wire:hasInputEndpoint/wire:InputEndpoint|wire:hasOutputEndpoint/wire:OutputEndpoint">
    <li>
      <div><strong><xsl:value-of select="rdfs:label"/></strong>
        (<code><span title="internal name"><xsl:value-of select="dcterms:title"/></span> : <span title="declared friendcode"><xsl:value-of select="wire:friendcode"/></span></code>):
        <xsl:value-of select="dcterms:description"/></div>
    </li>
  </xsl:template>

  <xsl:template match="wire:hasPlatformPreference/wire:PlatformPreference">
    <li>
      <div><span><xsl:value-of select="rdfs:label"/></span>
        (<code><xsl:value-of select="dcterms:title"/></code>):
        <xsl:value-of select="dcterms:description"/></div>
    </li>
  </xsl:template>
</xsl:stylesheet>
